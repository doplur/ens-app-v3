import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { chains, providers } from '@web3modal/ethereum'
import type { ConfigOptions } from '@web3modal/react'
import { Web3Modal } from '@web3modal/react'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { ReactElement, ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import { ThemeProvider, createGlobalStyle } from 'styled-components'

import { ThorinGlobalStyles, lightTheme as thorinLightTheme } from '@ensdomains/thorin'

import { Notifications } from '@app/components/Notifications'
import { TransactionStoreProvider } from '@app/hooks/transactions/TransactionStoreContext'
import { Basic } from '@app/layouts/Basic'
import { TransactionFlowProvider } from '@app/transaction-flow/TransactionFlowProvider'
import { BreakpointProvider } from '@app/utils/BreakpointProvider'
import { EnsProvider } from '@app/utils/EnsProvider'

import i18n from '../i18n'
import '../styles.css'

const GlobalStyle = createGlobalStyle`
  html,
  body {
    padding: 0;
    margin: 0;
  }

  *,
  ::before,
  ::after {
    font-family: Satoshi,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      Oxygen,
      Ubuntu,
      Cantarell,
      "Fira Sans",
      "Droid Sans",
      "Helvetica Neue",
      sans-serif;
  }

  body {
    background: radial-gradient(50% 50% at 50% 50%, rgba(82, 152, 255, 0.062) 0%, rgba(255, 255, 255, 0) 100%), #F7F7F7;
  }

  body, .min-safe {
    min-height: 100vh;
    /* stylelint-disable-next-line value-no-vendor-prefix */
    @supports (-webkit-touch-callout: none) {
      /* stylelint-disable-next-line value-no-vendor-prefix */
      min-height: -webkit-fill-available;
    }
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
    font-feature-settings: "ss01" on, "ss03" on;
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -moz-font-feature-settings: "ss01" on, "ss03" on;
  }
`

const breakpoints = {
  xs: '(min-width: 360px)',
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

// ------- web3 Modal Config -----------------------/
// To Get a projectId from WalletConnect Cloud, visit https://cloud.walletconnect.com/
const config: ConfigOptions = {
  projectId: '26ee9facbe4cbc407218b99540bc8053',
  theme: 'light',
  accentColor: 'default',
  ethereum: {
    appName: 'ENS',
    chains: [chains.goerli, chains.mainnet, chains.localhost],
    providers: [providers.walletConnectProvider({ projectId: '26ee9facbe4cbc407218b99540bc8053' })],
  },
}

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <QueryClientProvider client={queryClient}>
      <Web3Modal config={config} />
      <I18nextProvider i18n={i18n}>
        <TransactionStoreProvider>
          <EnsProvider>
            <ThemeProvider theme={thorinLightTheme}>
              <BreakpointProvider queries={breakpoints}>
                <GlobalStyle />
                <ThorinGlobalStyles />
                <TransactionFlowProvider>
                  <Notifications />
                  <Basic>{getLayout(<Component {...pageProps} />)}</Basic>
                </TransactionFlowProvider>
              </BreakpointProvider>
            </ThemeProvider>
          </EnsProvider>
        </TransactionStoreProvider>
      </I18nextProvider>
    </QueryClientProvider>
  )
}

export default MyApp
