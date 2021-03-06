// dom相关操作
export function addClass(el, className) {
    if (hasClass(el, className)) {
        return false
    }
    let newClass = el.className.split(' ')
    newClass.push(className)
    el.className = newClass.join(' ')
}

// 判断是否由当前的class
export function hasClass(el, className) {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    return reg.test(el.className)
}

// 获取标签中的data-  属性
export function getData(el, name, val) {
    const prefix = 'data-'
    name = prefix + name
    if (val) {
        return el.setAttribute(name, val)
    } else {
        return el.getAttribute(name)
    }
}