"use client";
import { ResponsiveCalendar } from "@nivo/calendar";
export default function PostsActivityCalendar({
  data,
}: {
  data: {
    day: string;
    value: number;
  }[];
}) {
  const today = new Date();
  return (
    <div>
    <div className="h-[250px]">
      <ResponsiveCalendar
        emptyColor="#F2F4F6"
        colors={["#D6E2E6", "#84ABB4", "#2C7685", "#00687A"]}
        data={data}
        from={`${today.getFullYear()}-01-01`}
        to={`${today.toISOString().split("T")[0]}`}
        yearSpacing={40}
        margin={{top : 20, right : 20, bottom : 20, left : 20}}
        monthBorderWidth={0}
        dayBorderColor="#ffffff"
        dayBorderWidth={2}
        legends={[
            {
                anchor : "bottom-right",
                direction : "row",
                translateY : 36,
                itemCount :5,
                itemWidth : 24,
                itemHeight : 34,
                itemsSpacing : 4,
                symbolSize : 14
            }
        ]}
      />
    </div>
    <div className="mt-0 flex items-center -translate-y-24 md:-translate-y-10 justify-end  p-2 rounded-lg gap-2 text-sm text-gray-600 ">
        <span>Less</span>
        <div className="h-3 w-3 rounded-xs border bg-[#eef2f6]" />
        <div className="h-3 w-3 rounded-xs bg-[#84ABB4]" />
        <div className="h-3 w-3 rounded-xs bg-[#5B909D]" />
        <div className="h-3 w-3 rounded-xs bg-[#2C7685]" />
        <div className="h-3 w-3 rounded-xs bg-[#00687A]" />
        <span>More</span>
    </div>
    </div>
  );
}
