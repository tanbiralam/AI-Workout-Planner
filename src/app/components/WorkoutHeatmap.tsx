import React, { memo, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getHeatmapHexColor,
  formatDateForTooltip,
  getMonthLabel,
} from "@/lib/heatmapUtils";
import { useWorkoutHeatmap } from "@/hooks/useWorkoutHeatmap";

const CELL_SIZE = 12;
const CELL_GAP = 2;

interface HeatmapCellProps {
  dateKey: string;
  count: number;
  onPress: (dateKey: string, count: number) => void;
}

/**
 * Individual heatmap cell - memoized for performance
 */
const HeatmapCell = memo<HeatmapCellProps>(({ dateKey, count, onPress }) => {
  if (!dateKey) {
    // Empty placeholder cell
    return (
      <View
        style={{
          width: CELL_SIZE,
          height: CELL_SIZE,
          marginBottom: CELL_GAP,
        }}
      />
    );
  }

  return (
    <TouchableOpacity
      onPress={() => onPress(dateKey, count)}
      activeOpacity={0.7}
      style={{
        width: CELL_SIZE,
        height: CELL_SIZE,
        borderRadius: 2,
        backgroundColor: getHeatmapHexColor(count),
        marginBottom: CELL_GAP,
      }}
    />
  );
});

HeatmapCell.displayName = "HeatmapCell";

interface WeekColumnProps {
  week: string[];
  countsByDate: Record<string, number>;
  onCellPress: (dateKey: string, count: number) => void;
}

/**
 * Single week column (7 days) - memoized for performance
 */
const WeekColumn = memo<WeekColumnProps>(
  ({ week, countsByDate, onCellPress }) => {
    return (
      <View style={{ marginRight: CELL_GAP }}>
        {week.map((dateKey, dayIndex) => (
          <HeatmapCell
            key={dateKey || `empty-${dayIndex}`}
            dateKey={dateKey}
            count={countsByDate[dateKey] || 0}
            onPress={onCellPress}
          />
        ))}
      </View>
    );
  }
);

WeekColumn.displayName = "WeekColumn";

interface TooltipModalProps {
  visible: boolean;
  dateKey: string;
  count: number;
  onClose: () => void;
}

/**
 * Tooltip modal shown when a cell is pressed
 */
const TooltipModal: React.FC<TooltipModalProps> = ({
  visible,
  dateKey,
  count,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/60"
        onPress={onClose}
      >
        <View className="bg-zinc-800 rounded-2xl p-5 mx-8 border border-zinc-700">
          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 bg-blue-500/20 rounded-lg items-center justify-center mr-3">
              <Ionicons name="calendar" size={16} color="#3b82f6" />
            </View>
            <Text className="text-white font-bold text-lg">
              {formatDateForTooltip(dateKey)}
            </Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-green-500/20 rounded-lg items-center justify-center mr-3">
              <Ionicons name="fitness" size={16} color="#22c55e" />
            </View>
            <Text className="text-zinc-300 text-base">
              Workouts: <Text className="text-white font-bold">{count}</Text>
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            className="mt-4 bg-zinc-700 rounded-xl py-2.5 items-center"
            activeOpacity={0.7}
          >
            <Text className="text-zinc-300 font-medium">Close</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

interface MonthLabelsProps {
  weeks: string[][];
}

/**
 * Month labels displayed above the heatmap grid
 */
const MonthLabels: React.FC<MonthLabelsProps> = ({ weeks }) => {
  // Collect month labels with their positions
  const monthLabels = useMemo(() => {
    const labels: { month: string; position: number }[] = [];
    let lastMonth = "";

    weeks.forEach((week, weekIndex) => {
      // Find the first valid date in the week
      const firstValidDate = week.find((d) => d);
      if (firstValidDate) {
        const month = getMonthLabel(firstValidDate);
        if (month !== lastMonth) {
          labels.push({ month, position: weekIndex });
          lastMonth = month;
        }
      }
    });

    return labels;
  }, [weeks]);

  return (
    <View className="flex-row mb-1" style={{ height: 14 }}>
      {monthLabels.map(({ month, position }, index) => (
        <Text
          key={`${month}-${index}`}
          className="text-zinc-500 text-[10px]"
          style={{
            position: "absolute",
            left: position * (CELL_SIZE + CELL_GAP),
          }}
        >
          {month}
        </Text>
      ))}
    </View>
  );
};

interface WorkoutHeatmapProps {
  userId?: string;
}

/**
 * 365-day workout heatmap component
 * Shows workout consistency over the past year with GitHub-style visualization
 */
export function WorkoutHeatmap({ userId }: WorkoutHeatmapProps) {
  const { weeks, countsByDate, loading, hasLoaded, totalWorkouts } =
    useWorkoutHeatmap(userId);

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState({ dateKey: "", count: 0 });

  const handleCellPress = useCallback((dateKey: string, count: number) => {
    setSelectedDate({ dateKey, count });
    setTooltipVisible(true);
  }, []);

  const handleCloseTooltip = useCallback(() => {
    setTooltipVisible(false);
  }, []);

  // Show empty state if no workouts exist
  const showEmptyState = hasLoaded && totalWorkouts === 0;

  return (
    <View className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800/50">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-base font-bold text-white">
          Workout Consistency
        </Text>
        {hasLoaded && totalWorkouts > 0 && (
          <Text className="text-xs text-zinc-500">
            {totalWorkouts} workout{totalWorkouts !== 1 ? "s" : ""} this year
          </Text>
        )}
      </View>

      {loading && !hasLoaded ? (
        // Loading state
        <View className="h-24 items-center justify-center">
          <Text className="text-zinc-500 text-sm">Loading...</Text>
        </View>
      ) : showEmptyState ? (
        // Empty state
        <View className="py-6 items-center">
          <View className="w-14 h-14 bg-blue-500/10 rounded-2xl items-center justify-center mb-3">
            <Ionicons name="flame-outline" size={28} color="#3b82f6" />
          </View>
          <Text className="text-white font-medium text-base mb-1">
            Start your streak today
          </Text>
          <Text className="text-zinc-500 text-sm text-center">
            Complete your first workout to begin{"\n"}tracking your consistency
          </Text>
        </View>
      ) : (
        // Heatmap grid
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          <View>
            <MonthLabels weeks={weeks} />
            <View className="flex-row">
              {weeks.map((week, weekIndex) => (
                <WeekColumn
                  key={weekIndex}
                  week={week}
                  countsByDate={countsByDate}
                  onCellPress={handleCellPress}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      {/* Legend */}
      {hasLoaded && totalWorkouts > 0 && (
        <View className="flex-row items-center justify-end mt-3 pt-3 border-t border-zinc-800/50">
          <Text className="text-zinc-500 text-[10px] mr-2">Less</Text>
          {[0, 1, 2, 3, 4, 5].map((count) => (
            <View
              key={count}
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                backgroundColor: getHeatmapHexColor(count),
                marginHorizontal: 1,
              }}
            />
          ))}
          <Text className="text-zinc-500 text-[10px] ml-2">More</Text>
        </View>
      )}

      {/* Tooltip Modal */}
      <TooltipModal
        visible={tooltipVisible}
        dateKey={selectedDate.dateKey}
        count={selectedDate.count}
        onClose={handleCloseTooltip}
      />
    </View>
  );
}

export default WorkoutHeatmap;
