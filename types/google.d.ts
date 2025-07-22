interface Window {
  google: {
    accounts: {
      id: {
        initialize: (config: {
          client_id: string
          callback: (response: any) => void
          auto_select?: boolean
          cancel_on_tap_outside?: boolean
        }) => void
        renderButton: (
          element: HTMLElement,
          options: {
            type?: string
            theme?: string
            size?: string
            width?: string | number
            text?: string
            shape?: string
          }
        ) => void
        disableAutoSelect: () => void
      }
      oauth2?: {
        initTokenClient: (config: any) => any
        revoke: (token: string, callback: () => void) => void
      }
    }
  }
}


type DataSheet = {
  headers: string[]
  [key: string]: any
}

type Section = "gestiones" | "equipos" | "usuarios" | "search" | "dashboard" | ""

export type { DataSheet, Section, Window }