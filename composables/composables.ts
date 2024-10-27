export const useCheckedTime = (data: Ref<{timestamp: number} | null>) => {
  return computed(() => {
    if (!data.value) {
      return Date.now()
    } else if (checkTime(data.value.timestamp)) {
      return Date.now()
    } else {
      return data.value.timestamp
    }
  })
}