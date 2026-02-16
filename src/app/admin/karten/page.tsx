import { getMenuAndDrinksPages } from '@/app/actions/admin-menu'
import { MenuCardsEditor } from '@/components/admin/MenuCardsEditor'

export default async function AdminMenuCardsPage() {
    const { menuPage, drinksPage } = await getMenuAndDrinksPages()

    return <MenuCardsEditor initialMenuPage={menuPage} initialDrinksPage={drinksPage} />
}
