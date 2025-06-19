export const slugify = (str) => 
    str 
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, '-')
    .replace(/[^\w-]+/g, '');

export const getAvatarUrl = (autor) => {
    if (autor?.avatar) {
        return autor.avatar;
    }
    const initials = autor?.name
        ? autor.name.split(' ').map(n => n[0]).join('').toUpperCase()
        : 'U';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=e8b44a&color=fff&size=40&font-size=0.6`;
}

export const truncateText = (text, maxLength = 100) => {
    if (!text) return 'No especificado';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}