export class Restaurant {
    _id: string;
    name: string;
    description: string;
    category: string;
    campus: string;
    address: string;
    priceRange: [number];
    phone: string;
    imagesUrl: [string];
    rating: number;
    openTime: any;

    constructor() {
        this._id = '';
        this.name = '';
        this.description = '';
        this.category = '';
        this.campus = '';
        this.address = '';
        this.priceRange = [0];
        this.phone = '';
        this.imagesUrl = [''];
        this.rating = 0;
        this.openTime = {};
    }
}