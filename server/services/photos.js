import axios from "axios"

function getPhotos() {
    return getDynamicPhotos()
    //return getStaticPhotos()
}

function getDynamicPhotos() {
    return axios.get("https://dog.ceo/api/breeds/image/random/4").
        then(response => {
            console.log(response.data)
            return response.data
        })
}

function getStaticPhotos() {
    return new Promise((resolution, reject) => {
        resolution({
            message: [
              'https://images.dog.ceo/breeds/bulldog-french/n02108915_8425.jpg',
              'https://images.dog.ceo/breeds/terrier-australian/n02096294_7000.jpg',
              'https://images.dog.ceo/breeds/bouvier/n02106382_3437.jpg',
              'https://images.dog.ceo/breeds/bouvier/n02106382_4504.jpg'
            ],
            status: 'success'
          })
    })
}

export { getPhotos }