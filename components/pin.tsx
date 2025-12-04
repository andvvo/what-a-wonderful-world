import { PinColor, PIN_COLORS } from "@/lib/pins";

type PinProps = {
  color?: PinColor;
};

export default function Pin({ color = "red" }: PinProps) {
  const colorHex = PIN_COLORS.find((c) => c.value === color)?.hex || "#EF4444";
  
  return (
    <div className="text-4xl" style={{ filter: `drop-shadow(0 2px 2px rgba(0,0,0,0.3))` }}>
      <svg
        width="32"
        height="40"
        viewBox="0 0 32 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 0C7.16 0 0 7.16 0 16C0 28 16 40 16 40C16 40 32 28 32 16C32 7.16 24.84 0 16 0Z"
          fill={colorHex}
        />
        <circle cx="16" cy="16" r="6" fill="white" />
      </svg>
    </div>
  );
}
