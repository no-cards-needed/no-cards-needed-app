export const setItem = (key, value) => {
    if(typeof window !== 'undefined'){
        window.localStorage.setItem(key, value)
   }
}

export const getItem = (key) => {
    if(typeof window !== 'undefined'){
        return window.localStorage.getItem(key)
   }
}