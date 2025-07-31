document.addEventListener('DOMContentLoaded', () => {
  const blogList = document.getElementById('blog-list');
  const user = JSON.parse(localStorage.getItem('davintoUser'));

  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  // Fetch all blog posts
  async function fetchBlogs() {
    try {
      const res = await fetch('/api/blog/list');
      const data = await res.json();

      if (res.ok) {
        blogList.innerHTML = '';
        data.blogs.forEach(blog => {
          const div = document.createElement('div');
          div.className = 'post-preview';
          div.innerHTML = `
            <h3>${blog.title}</h3>
            <p><em>by ${blog.username}</em></p>
            <p>${truncate(blog.content, 100)}</p>
          `;

          div.addEventListener('click', () => {
            window.location.href = `blog.html?id=${blog.id}`;
          });

          blogList.appendChild(div);
        });
      } else {
        blogList.innerHTML = '<p>Error loading blogs.</p>';
      }
    } catch (error) {
      console.error('Error loading blogs:', error);
      blogList.innerHTML = '<p>Failed to fetch blog posts.</p>';
    }
  }

  function truncate(text, length) {
    return text.length > length ? text.substring(0, length) + '...' : text;
  }

  fetchBlogs();
});