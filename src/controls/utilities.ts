export function FormattedDay(date: Date|undefined = undefined): string {
    const now = date == undefined ? new Date() : date;

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Aylar 0-11 arası olduğu için +1 eklenir
    const day = now.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function FormattedDate(date: Date|undefined = undefined): string {

    const now = date == undefined ? new Date() : date;

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Aylar 0-11 arası olduğu için +1 eklenir
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}