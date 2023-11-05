import {
  useTimezoneSelect,
  allTimezones,
  ITimezoneOption,
  ILabelStyle,
} from 'react-timezone-select'

const labelStyle: ILabelStyle = 'original'

interface TimezoneSelectorProps {
  value: string
  onChange: (timezone: ITimezoneOption) => void
}

export function TimezoneSelector({ value, onChange }: TimezoneSelectorProps) {
  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones: allTimezones,
  })

  return (
    <select
      className="select select-bordered w-full max-w-xs"
      onChange={(e) => onChange(parseTimezone(e.currentTarget.value))}
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          selected={value === option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  )
}
