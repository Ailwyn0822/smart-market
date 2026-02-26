export function validateProductForm(formData: {
    name: string;
    description: string;
    categoryId: number | string;
    price: string | number;
    imageUrl: string;
}) {
    const errors: string[] = [];

    if (!formData.name || formData.name.trim() === '') {
        errors.push('name');
    }
    if (!formData.description || formData.description.trim() === '') {
        errors.push('description');
    }
    if (!formData.categoryId || Number(formData.categoryId) <= 0) {
        errors.push('categoryId');
    }
    if (!formData.price || Number(formData.price) <= 0) {
        errors.push('price');
    }
    if (!formData.imageUrl || formData.imageUrl.trim() === '') {
        errors.push('imageUrl');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}
