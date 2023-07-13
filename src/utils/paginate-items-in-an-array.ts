export function paginateArrayIn20PerPage(array:any[], page:number) {
    const items_per_page = 20
    const start_index = (page - 1) * items_per_page
    const end_index = start_index + items_per_page
    return array.slice(start_index, end_index)
}