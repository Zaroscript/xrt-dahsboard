import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  type: 'website' | 'design' | 'app';
  category: 'recipe_sharing' | 'restaurant' | 'food_blog' | 'catering' | 'other';
  imageUrl: string;
  projectUrl?: string;
  clientName: string;
  technologies: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface Review {
  id: string;
  projectId: string;
  clientName: string;
  clientEmail: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

interface PortfolioState {
  projects: PortfolioProject[];
  reviews: Review[];
  selectedProject: PortfolioProject | null;
  loading: boolean;
  filter: 'all' | 'published' | 'draft' | 'archived';
}

const initialState: PortfolioState = {
  projects: [],
  reviews: [],
  selectedProject: null,
  loading: false,
  filter: 'all',
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<PortfolioProject[]>) => {
      state.projects = action.payload;
    },
    addProject: (state, action: PayloadAction<PortfolioProject>) => {
      state.projects.push(action.payload);
    },
    updateProject: (state, action: PayloadAction<PortfolioProject>) => {
      const index = state.projects.findIndex(project => project.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    },
    setReviews: (state, action: PayloadAction<Review[]>) => {
      state.reviews = action.payload;
    },
    addReview: (state, action: PayloadAction<Review>) => {
      state.reviews.push(action.payload);
    },
    updateReview: (state, action: PayloadAction<Review>) => {
      const index = state.reviews.findIndex(review => review.id === action.payload.id);
      if (index !== -1) {
        state.reviews[index] = action.payload;
      }
    },
    setSelectedProject: (state, action: PayloadAction<PortfolioProject | null>) => {
      state.selectedProject = action.payload;
    },
    setFilter: (state, action: PayloadAction<PortfolioState['filter']>) => {
      state.filter = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { 
  setProjects, 
  addProject, 
  updateProject, 
  setReviews, 
  addReview, 
  updateReview, 
  setSelectedProject, 
  setFilter, 
  setLoading 
} = portfolioSlice.actions;
export default portfolioSlice.reducer;