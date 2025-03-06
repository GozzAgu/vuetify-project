<template>
  <v-container class="pa-6">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card elevation="5">
          <v-img
            :src="post.image"
            height="300px"
            class="mb-4"
          ></v-img>
          
          <v-card-title class="text-h5 font-weight-bold">
            <v-text-field
              v-if="isEditing"
              v-model="post.title"
              label="Title"
              variant="outlined"
              class="mb-2"
            />
            <span v-else>{{ post.title }}</span>
          </v-card-title>

          <v-card-subtitle class="text-body-1">
            <span v-if="isEditing">
              <v-text-field
                v-model="post.date"
                label="Date"
                variant="outlined"
                class="mb-2"
              />
            </span>
            <span v-else>{{ post.date }}</span>
          </v-card-subtitle>

          <v-divider class="my-4"></v-divider>

          <v-card-text class="body-1">
            <div v-if="isEditing">
              <v-textarea
                v-model="post.excerpt"
                label="Excerpt"
                variant="outlined"
                class="mb-4"
              />
            </div>
            <div v-else>
              <div v-html="post.excerpt"></div>
            </div>
          </v-card-text>

          <v-divider class="my-4"></v-divider>

          <v-card-actions>
            <v-btn color="primary" @click="goBack" class="mt-4">
              Go Back
            </v-btn>

            <v-btn v-if="isEditing" color="success" @click="saveChanges" class="mt-4">
              Save Changes
            </v-btn>

            <v-btn v-if="!isEditing" color="warning" @click="editPost" class="mt-4">
              <v-icon color="warning">mdi-pencil</v-icon>
            </v-btn>

            <v-btn v-if="!isEditing" color="error" @click="deletePost" class="mt-4">
              <v-icon color="error">mdi-delete</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const post = ref({
  title: '',
  date: '',
  excerpt: '',
  image: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
});

const isEditing = ref(false);

const loadBlogPosts = () => {
  const storedBlogs = localStorage.getItem('blogPosts');
  return storedBlogs ? JSON.parse(storedBlogs) : [];
};

onMounted(() => {
  const postId = route.params.id;
  const blogData = loadBlogPosts();

  const selectedPost = blogData.find((p: { id: number }) => p.id === Number(postId));
  if (selectedPost) {
    post.value = selectedPost;
  } else {
    post.value = { title: 'Post Not Found', date: '', excerpt: '', content: 'Sorry, the post you are looking for does not exist.' };
  }
});

const goBack = () => {
  router.push('/');
};

const editPost = () => {
  isEditing.value = true;
};

const saveChanges = () => {
  const blogData = loadBlogPosts();
  const postId = route.params.id;

  const updatedPostIndex = blogData.findIndex((p: { id: number }) => p.id === Number(postId));

  if (updatedPostIndex !== -1) {
    blogData[updatedPostIndex] = post.value;
    localStorage.setItem('blogPosts', JSON.stringify(blogData));
    isEditing.value = false;
  }
};

const deletePost = () => {
  const blogData = loadBlogPosts();
  const postId = route.params.id;

  const updatedBlogData = blogData.filter((p: { id: number }) => p.id !== Number(postId));

  localStorage.setItem('blogPosts', JSON.stringify(updatedBlogData));
  router.push('/');
};
</script>

<style scoped>
.v-card {
  border-radius: 10px;
}

.v-img {
  border-radius: 10px;
}

.v-card-title {
  font-weight: bold;
}

.v-card-subtitle {
  font-size: 1.1rem;
  color: #616161;
}

.v-card-text {
  font-size: 1rem;
  line-height: 1.6;
  color: #424242;
}

.v-btn {
  font-weight: 500;
}

.v-divider {
  background-color: #e0e0e0;
}
</style>