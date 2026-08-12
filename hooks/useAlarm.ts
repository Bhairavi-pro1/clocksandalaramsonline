import { useStore } from './useStore'

export function useAlarm() {
  const activeAlarmId = useStore((state) => state.activeAlarmId)
  const setRingingAlarmId = useStore((state) => state.setRingingAlarmId)

  const stopAlarm = () => {
    setRingingAlarmId(null)
  }

  return { activeAlarmId, stopAlarm }
}
