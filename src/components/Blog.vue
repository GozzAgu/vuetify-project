<template>
  <v-container class="py-12 d-flex flex-wrap">
    <v-row class="flex-grow-1">
      <v-col cols="12" md="8">
        <v-alert v-if="blogPosts.length === 0" type="info" class="mt-4" border="left">
          No blog posts available. Start by creating one!
        </v-alert>

        <v-card class="blog-card mb-6" v-for="post in blogPosts" :key="post.id">
          <v-img :src="post.image" height="300px" cover></v-img>
          <v-card-title class="text-h5 font-weight-bold">{{ post.title }}</v-card-title>
          <v-card-subtitle>{{ post.date }}</v-card-subtitle>
          <v-card-subtitle>Author: {{ post.author }}</v-card-subtitle>
          <v-card-text>{{ post.excerpt }}</v-card-text>
          <v-card-actions class="d-flex justify-space-between">
            <div>
              <v-btn variant="text" class="like-btn">
                <v-icon left>mdi-thumb-up</v-icon> {{ post.likes }}
              </v-btn>
              <v-btn variant="text" class="comment-btn">
                <v-icon left>mdi-comment</v-icon> {{ post.comments }}
              </v-btn>
            </div>
            <div>
              <v-btn color="primary" variant="flat" @click="viewPost(post.id)">Read More</v-btn>
              <v-btn icon @click="editBlog(post)">
                <v-icon color="warning">mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="deleteBlog(post.id)">
                <v-icon color="error">mdi-delete</v-icon>
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-col cols="12" md="4" :class="{'fixed-form': isLargeScreen}">
      <v-card class="pa-4 create-blog-card" elevation="4">
        <v-card-title class="text-h6">{{ isEditing ? 'Edit Blog Post' : 'Create Blog Post' }}</v-card-title>
        <v-form ref="form" @submit.prevent="isEditing ? updateBlog() : addBlog()">
          <v-text-field v-model="newBlog.title" label="Title" variant="outlined" :rules="rules.title" required></v-text-field>
          <v-textarea v-model="newBlog.excerpt" label="Excerpt" variant="outlined" :rules="rules.excerpt" required></v-textarea>
          <v-btn color="primary" block type="submit">{{ isEditing ? 'Update Blog' : 'Add Blog' }}</v-btn>
        </v-form>
      </v-card>
    </v-col>

    <v-snackbar v-model="snackbar.visible" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
      <v-btn color="white" text @click="snackbar.visible = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter(); 

const getCurrentDateTime = () => {
  const now = new Date();
  return now.toLocaleString();
};

const loadBlogPosts = () => {
  const storedBlogs = localStorage.getItem('blogPosts');
  if (storedBlogs) {
    return JSON.parse(storedBlogs);
  }
  return [];
};

const blogPosts = ref(loadBlogPosts());
const newBlog = ref({ title: '', author: 'You', date: getCurrentDateTime(), excerpt: '', image: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg', likes: 0, comments: 0 });
const isEditing = ref(false);
const currentBlogId = ref<number | null>(null);
const form = ref(null);

const snackbar = ref({
  visible: false,
  message: '',
  color: 'success',
});

const rules = {
  title: [(v: string) => !!v || 'Title is required', (v: string) => (v && v.length >= 5) || 'Title must be at least 5 characters'],
  date: [(v: string) => !!v || 'Date is required'],
  excerpt: [(v: string) => !!v || 'Excerpt is required', (v: string) => (v && v.length >= 10) || 'Excerpt must be at least 10 characters'],
};

const saveBlogPosts = () => {
  localStorage.setItem('blogPosts', JSON.stringify(blogPosts.value));
};

const addBlog = async () => {
  const isValid = await form.value.validate();
  if (!isValid.valid) return;

  const newId = blogPosts.value.length ? Math.max(...blogPosts.value.map(post => post.id)) + 1 : 1;
  const newPost = {
    ...newBlog.value,
    id: newId,
    date: getCurrentDateTime(),
  };
  blogPosts.value.push(newPost);
  saveBlogPosts();
  showSnackbar('Blog added successfully!', 'success');
  resetForm();
};

const updateBlog = async () => {
  const isValid = await form.value.validate();
  if (!isValid.valid) return;

  const updatedPost = blogPosts.value.find((post) => post.id === currentBlogId.value);
  if (updatedPost) {
    updatedPost.title = newBlog.value.title;
    updatedPost.date = newBlog.value.date;
    updatedPost.excerpt = newBlog.value.excerpt;
    saveBlogPosts(); // Save to local storage
    showSnackbar('Blog updated successfully!', 'success');
  }
  resetForm();
};

const deleteBlog = (id: number) => {
  const index = blogPosts.value.findIndex((post) => post.id === id);
  if (index !== -1) {
    blogPosts.value.splice(index, 1);
    saveBlogPosts();
    showSnackbar('Blog deleted successfully!', 'error');
  }
};

const editBlog = (post: any) => {
  isEditing.value = true;
  currentBlogId.value = post.id;
  newBlog.value = { ...post };
};

const viewPost = (id: number) => {
  router.push({ name: 'blogpost', params: { id } });
};

const showSnackbar = (message: string, color: string) => {
  snackbar.value.message = message;
  snackbar.value.color = color;
  snackbar.value.visible = true;
};

const resetForm = () => {
  isEditing.value = false;
  currentBlogId.value = null;
  newBlog.value = {
    title: '',
    date: newBlog.value.date,
    excerpt: '',
    image: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
    likes: 0,
    comments: 0
  };

  nextTick(() => {
    form.value.reset();
  });
};

const isLargeScreen = computed(() => window.innerWidth >= 960);
</script>

<style scoped>
.fixed-form {
  position: fixed;
  top: 100px;
  right: 20px;
  width: 300px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  border-radius: 8px;
}

.create-blog-card {
  margin-top: 20px;
}

@media (max-width: 960px) {
  .fixed-form {
    position: static;
    width: 100%;
    max-height: none;
  }
}
</style>