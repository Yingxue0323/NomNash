export class Review {
    _id: string;
    restaurantId: string;
    userId: string;
    rating: number;
    text: string;
    imagesUrl: [string];
    reply: string;
    replyAt: Date;
    replyBy: string;

    constructor() {
        this._id = '';
        this.restaurantId = '';
        this.userId = '';
        this.rating = 0;
        this.text = '';
        this.imagesUrl = [''];
        this.reply = '';
        this.replyAt = new Date();
        this.replyBy = '';
    }
}