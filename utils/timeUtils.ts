export function formatSecondsToMinutesAndSeconds(totalSeconds: number): string {
    if (totalSeconds < 0) {
      return "N/A"; // Handle negative time if that's a possible edge case
    }
    if (totalSeconds === 0) {
      return "0s";
    }
  
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
  
    let result = "";
  
    if (minutes > 0) {
      result += `${minutes}m`;
    }
  
    if (seconds > 0) {
      // If minutes were added, add a space before seconds for readability
      if (result !== "") {
        result += " ";
      }
      result += `${seconds}s`;
    }
  
    return result;
  }
  