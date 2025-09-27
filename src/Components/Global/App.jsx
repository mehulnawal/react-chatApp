import { ThemeProvider } from "./Theme"
import { LoginComponent } from "./Login"
import { RegistrationComponent } from "./Registration"
import { BrowserRouter, Route, Routes } from "react-router"
import { UserProfileSettingsComponent } from "../User/ProfileSettings"
import ProfileAvatarComponent from "../User/ProfileAvatar"
import ErrorPage from "./Error"
import { UserDashBoard } from "../User/UserDashBoard"
import { NewChatModalProvider, UserDataProvider } from "./GlobalData"

function App() {
  return (
    <>
      <ThemeProvider>
        <UserDataProvider>
          <NewChatModalProvider>
            <BrowserRouter>

              <Routes>
                {/* Global */}
                <Route path="/" element={<LoginComponent />} />
                <Route path="/register" element={<RegistrationComponent />} />
                <Route path="*" element={<ErrorPage />} />

                {/* users */}
                <Route path="/user" element={<UserDashBoard />} />
                <Route path="/profileSettings" element={<UserProfileSettingsComponent />} />
              </Routes>

            </BrowserRouter>
          </NewChatModalProvider>
        </UserDataProvider>
      </ThemeProvider>

    </>
  )
}

export default App
