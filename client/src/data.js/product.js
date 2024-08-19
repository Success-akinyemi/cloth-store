import LaceImg from '../assets/makeUp6.jpg'
import AsokeImg from '../assets/makeUp7.jpg'
import AnkaraImg from '../assets/ankara.jpg'

export const product = {
    _id: 1,
    img: LaceImg,
    name: 'lace fabric Material',
    price: 20000,
    desc: 'Black lace material 5yards',
    quantity: 30,
    size: [
        'XL',
        'L',
        'M'
    ],
    color: [
        'black',
        'green',
        'purple'
    ],
    category: [
        'lacefabric',
        'wrapper'
    ],
    imgArray: {
        AsokeImg,
        AnkaraImg
    },
    isDiscountAllowed: true,
    discountPercent: 20,
    discountPrice: 16000,
    productReview: [
        {
            _id: 11,
            username: 'Francis',
            review: 'A nice lace and picture',
            createdAt : '2023-12-02T17:13:19.708Z'
        },
        {
            _id: 22,
            username: 'Francis',
            review: 'A nice lace and picture',
            createdAt : '2023-12-02T17:13:19.708Z'
        },            {
            _id: 33,
            username: 'Francis',
            review: 'A nice lace and picture',
            createdAt : '2023-12-02T17:13:19.708Z'
        },
    ],
    likes: [
        '656b65aff07aa4c8fdce922f',
        '656b65aff07aa4c8fdce922f',
        '656b65aff07aa4c8fdce922f'
    ]
}