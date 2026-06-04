// import React from 'react'

// // eslint-disable-next-line @typescript-eslint/no-explicit-any

// export function useEvent(callback) {
//     const ref = React.useRef(() => {
//         throw new Error('Cannot call an event handler while rendering.')
//     })

//     React.useInsertionEffect(() => {
//         ref.current = callback
//     })

//     return React.useCallback((...args) => {
//         return ref.current?.(...args)
//     }, [])
// }


import React from 'react'

export function useEvent<T extends (...args: any[]) => any>(callback?: T) {
  const ref = React.useRef<T | undefined>(undefined)

  React.useInsertionEffect(() => {
    ref.current = callback
  })

  return React.useCallback((...args: Parameters<T>) => {
    if (!ref.current) {
      throw new Error('Cannot call an event handler while rendering.')
    }
    return ref.current(...args)
  }, [])
}
