  const images = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ];

  let currentIndex = 0;

  const imageContainer = document.getElementById('imageContainer');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const imageCounter = document.getElementById('imageCounter');

  const showImage = (index) => {
    imageContainer.innerHTML = '';

    const img = document.createElement('img');
    img.src = images[index];
    img.alt = `Изображение ${index + 1}`;
    imageContainer.appendChild(img);
    imageCounter.textContent = `Изображение ${index + 1} из ${images.length}`;
  }

  prevBtn.addEventListener('click', () => {
    currentIndex--;
    if (currentIndex < 0) {
      currentIndex = images.length -1;
    }
    showImage(currentIndex);
  });

  nextBtn.addEventListener('click', () => {
    currentIndex++;
    if (currentIndex >= images.length) {
      currentIndex = 0;
    }
    showImage(currentIndex);
  });

  showImage(currentIndex);