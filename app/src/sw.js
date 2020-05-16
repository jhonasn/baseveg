const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // IPv6
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
)

export async function register(config) {
  if ('serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href)
    // Our service worker won't work if PUBLIC_URL is on a different origin
    if (publicUrl.origin !== window.location.origin) return

    window.addEventListener('load', async () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`

      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config)

        // Add some additional logging to localhost, pointing developers to the
        // service worker/PWA documentation.
        await navigator.serviceWorker.ready
        console.log('App served as cache-first by service worker')
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, config)
      }
    })
  }
}

async function registerValidSW(swUrl, config) {
  try {
    const registration = await navigator.serviceWorker.register(swUrl)
    registration.onupdatefound = () => {
      const installingWorker = registration.installing
      if (!installingWorker) return

      installingWorker.onstatechange = () => {
        if (installingWorker.state === 'installed') {
          const { controller } = navigator.serviceWorker
          if (controller) {
            // TODO: implement prettier asking to close other tabs
            const canClose = window.confirm(
              'Atualização disponível, deseja atualizar agora?\n\n' +
              'É necessário fechar todas as abas para atualizar o aplicativo'
            )

            // TODO: implement close other tabs
            if (canClose) {
              controller.postMessage('closeTabs')
              window.location.reload()
            }

            // Execute callback
            if (config && config.onUpdate) config.onUpdate(registration)
          } else {
            console.log('Content is cached for offline use.')

            // Execute callback
            if (config && config.onSuccess) {
              config.onSuccess(registration)
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error during service worker registration:', error)
    return
  }
}

async function checkValidServiceWorker(swUrl, config) {
  try {
    // Check if the service worker can be found. If it can't reload the page.
    const response = await fetch(swUrl)
    // Ensure service worker exists, and that we really are getting a JS file.
    const contentType = response.headers.get('content-type')
    if (
      response.status === 404 ||
      (contentType != null && contentType.indexOf('javascript') === -1)
    ) {
      // No service worker found. Probably a different app. Reload the page.
      const registration = await navigator.serviceWorker.ready
      await registration.unregister()
      window.location.reload()
    } else {
      // Service worker found. Proceed as normal.
      registerValidSW(swUrl, config)
    }
  } catch {
    console.log('No internet connection found. App is running in offline mode.')
    return
  }
}

export async function unregister() {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready
    registration.unregister()
  }
}

export const isInApp = () => window.matchMedia('(display-mode: standalone)').matches

export async function getInstallPrompt() {
  if (!('onbeforeinstallprompt' in window)) return null

  return new Promise((res, rej) => {
    const isInstalled = isInApp()
    if (isInstalled) {
      res(isInstalled)
      return
    }

    window.addEventListener('beforeinstallprompt', async e => {
      e.preventDefault()
      res(e)
    })
  })
}
