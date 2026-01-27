// Material UI
import { createTheme, ThemeProvider } from '@mui/material'
// Query
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
// Router
import { createRouter, RouterProvider, createRootRouteWithContext, Outlet } from '@tanstack/react-router'
// Dev tools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 10000, retry: 3, retryDelay: 1000 },
  },
})
const RootLayout = () => (
  <>
    <Outlet />
    <TanStackRouterDevtools />
  </>
)
const rootRoute = createRootRouteWithContext()({
  component: RootLayout,
})
const router = createRouter({
  rootRoute,
  context: {
    queryClient,
  },
})
const theme = createTheme({
  palette: {
    mode: 'dark',
    common: {
      white: '#FFFFFF',
      black: '#555555',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#FFFFFF',
      disabled: 'grey',
    },
    secondary: {
      light: '#F1C042',
      main: '#eeb113',
      dark: '#BE8D0F',
    },
    info: {
      main: '#FFFFFF',
    },
    success: {
      main: '#f9b609',
    },
    warning: {
      main: '#d29a41',
    },
    error: {
      main: '#f44336',
    },
    background: {
      default: '#353535',
      paper: '#353535',
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        color: 'textPrimary',
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          variants: [
            {
              props: { variant: 'surface' },

              style: {
                borderRadius: 20,
                backgroundColor: '#353535',
              },
            },
          ],
        },
      },
    },
    MuiToolbar: {
      defaultProps: {
        variant: 'dense',
      },
    },
  },
})

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} context={{ queryClient }} />
        </ThemeProvider>
      </QueryClientProvider>
    </div>
  )
}
export default App
