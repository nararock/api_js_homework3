const img = document.querySelector('.image');
const author = document.querySelector('.author');
const bio = document.querySelector('.bio');
const selectImg = document.querySelector('.selectImg');
const currentDate = new Date();
console.log(currentDate.getDate());
let like = false;

async function fetchPhoto() {
    let page = Math.floor(Math.random()*(300 - 2));
    console.log(page);
    try {
        const response = await fetch(`https://api.unsplash.com/photos/?client_id=y0MJCJzSfcGhENu1MGjwFofRORZQQDxnN9nDHuuWHTc&per_page=1&page=${page}`);
        const photos = await response.json();       
        return photos;
    } catch (error) {
        console.error('Ошибка при загрузке фотографий:', error);
        return [];
    }
}

async function loadPhoto() {
    let temp = await fetchPhoto();
    if (temp.length === 0){
        return setTimeout('loadPhoto()', 2000); 
    }
    const foto = temp[0];    
    author.textContent = `${foto.user.first_name} ${foto.user.last_name}`;
    img.src = foto.urls.small;
    if (foto.user.bio !==null){
        bio.textContent = `Об авторе: ${foto.user.bio}`;
    }
    window.localStorage.setItem('foto', JSON.stringify({day: currentDate.getDate(), 
        month:currentDate.getMonth(), like: false, img: foto.urls.small, first_name: foto.user.first_name, 
        last_name: foto.user.last_name, bio: foto.user.bio}));
}

window.addEventListener('load', () => {
    const data = JSON.parse(window.localStorage.getItem('foto'));
    if ((data.day !== currentDate.getDate() || data.month !== currentDate.getMonth()) || data === null){
        loadPhoto();        
    } else{
        author.textContent = `${data.first_name} ${data.last_name}`;
        img.src = data.img;
        if (data.bio !==null){
            bio.textContent = `Об авторе: ${data.bio}`;
        }
        if (data.like){
            const path = document.getElementsByTagName('path');
            path[0].classList.add('like');
        }
    }
});

selectImg.addEventListener('click', () => {
    const path = document.getElementsByTagName('path');
    const data = JSON.parse(window.localStorage.getItem('foto'));
    if (!document.querySelector('.like')){
        path[0].classList.add('like');
        data.like = true;
    } else{
        path[0].classList.remove('like');
        data.like = false;
    }
    window.localStorage.setItem('foto', JSON.stringify(data));
})


