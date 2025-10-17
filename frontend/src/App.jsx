import { Routes, Route } from 'react-router-dom'
import StoreLayout from './layouts/StoreLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import CheckoutSuccessPage from './pages/CheckoutSuccessPage.jsx'
import CheckoutFailurePage from './pages/CheckoutFailurePage.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminProducts from './pages/admin/AdminProducts.jsx'
import AdminOrders from './pages/admin/AdminOrders.jsx'
import AdminAffiliates from './pages/admin/AdminAffiliates.jsx'
import AdminPromotions from './pages/admin/AdminPromotions.jsx'
import AdminSettings from './pages/admin/AdminSettings.jsx'
import AdminReports from './pages/admin/AdminReports.jsx'
import LoginPage from './pages/LoginPage.jsx'

function App () {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route path='/' element={<HomePage />} />
        <Route path='/produtos/:slug' element={<ProductPage />} />
        <Route path='/checkout' element={<CheckoutPage />} />
        <Route path='/checkout/sucesso' element={<CheckoutSuccessPage />} />
        <Route path='/checkout/falha' element={<CheckoutFailurePage />} />
      </Route>

      <Route path='/admin/login' element={<LoginPage />} />
      <Route path='/admin' element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path='produtos' element={<AdminProducts />} />
        <Route path='pedidos' element={<AdminOrders />} />
        <Route path='afiliados' element={<AdminAffiliates />} />
        <Route path='promocoes' element={<AdminPromotions />} />
        <Route path='relatorios' element={<AdminReports />} />
        <Route path='configuracoes' element={<AdminSettings />} />
      </Route>
    </Routes>
  )
}

export default App
