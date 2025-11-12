import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginScreen from './src/screens/Auth/LoginScreen'
import RegisterScreen from './src/screens/Auth/RegisterScreen'
import ResetPasswordScreen from './src/screens/Auth/ResetPasswordScreen'
import UserProfileScreen from './src/screens/Profile/UserProfileScreen'
import EditProfileScreen from './src/screens/Profile/EditProfileScreen'
import SettingsScreen from './src/screens/Settings/SettingsScreen'
import ListScreen from './src/screens/List/ListScreen'
import DetailScreen from './src/screens/Details/DetailScreen'
import SearchScreen from './src/screens/Search/SearchScreen'
import NotificationsScreen from './src/screens/Notifications/NotificationsScreen'
import FormScreen from './src/screens/Form/FormScreen'
import PaymentScreen from './src/screens/Payment/PaymentScreen'
import TransactionDetailsScreen from './src/screens/Payment/TransactionDetails'
import ItemDetailsScreen from './src/screens/Details/ItemDetailsScreen'
import SuccessScreen from './src/screens/Feedback/SuccessScreen'
import OrderHistoryScreen from './src/screens/History/OrderHistoryScreen'
import HelpSupportScreen from './src/screens/Support/HelpSupportScreen'
import AdminPanelScreen from './src/screens/Admin/AdminPanelScreen'
import CurrentLocationScreen from './src/screens/Location/CurrentLocationScreen'
import AssignedOrdersScreen from './src/screens/AssignedOrders/AssignedOrdersScreen'
import RaportScreen from './src/screens/Raport/RaportScreen'
import AddRaportScreen from './src/screens/Raport/AddRaportScreen'
import UserRaportScreen from './src/screens/Raport/UserRaportsScreen'
import HomeScreen from './src/screens/Dashboard/HomeScreen'
import { ErrorProvider } from './src/screens/Feedback/ErrorContext'
import ErrorOverlay from './src/screens/Feedback/ErrorOverlay'
import { ThemeProvider } from './src/screens/ThemeContext/ThemeContext'
import Magazyn from './src/screens/Magazyn/Magazyn'
import Faktury from './src/screens/Faktury/Faktury'
import AiHelper from './src/screens/AiHelper/AiHelper'
import Messages from './src/screens/Messages/Messages'

function App() {
  return (
    <ThemeProvider>
      <ErrorProvider>
        <BrowserRouter>
          <ErrorOverlay />
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/reset-password" element={<ResetPasswordScreen />} />
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/profile" element={<UserProfileScreen />} />
            <Route path="/edit-profile" element={<EditProfileScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/list" element={<ListScreen />} />
            <Route path="/detail" element={<DetailScreen />} />
            <Route path="/item-detail/:id" element={<ItemDetailsScreen />} />
            <Route path="/search" element={<SearchScreen />} />
            <Route path="/notifications" element={<NotificationsScreen />} />
            <Route path="/form" element={<FormScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
            <Route path="/transaction-details" element={<TransactionDetailsScreen />} />
            <Route path="/success" element={<SuccessScreen />} />
            <Route path="/order-history" element={<OrderHistoryScreen />} />
            <Route path="/help-support" element={<HelpSupportScreen />} />
            <Route path="/admin" element={<AdminPanelScreen />} />
            <Route path="/location" element={<CurrentLocationScreen />} />
            <Route path="/assigned-orders" element={<AssignedOrdersScreen />} />
            <Route path="/raport" element={<RaportScreen />} />
            <Route path="/add-raport" element={<AddRaportScreen />} />
            <Route path="/user-rapports" element={<UserRaportScreen />} />
            <Route path="/magazyn" element={<Magazyn />} />
            <Route path="/faktury" element={<Faktury />} />
            <Route path="/ai" element={<AiHelper />} />
            <Route path="/wiadomosci" element={<Messages />} />
          </Routes>
        </BrowserRouter>
      </ErrorProvider>
    </ThemeProvider>
  )
}

export default App
