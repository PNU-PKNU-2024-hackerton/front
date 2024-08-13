export function formatDateTime(input: string): string {
    const date = new Date(input);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "오후" : "오전";
    hours = hours % 12 || 12; // 0시를 12시로 표현

    return `${year}.${month}.${day} ${ampm} ${hours}:${minutes}`
}