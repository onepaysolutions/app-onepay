import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface FeaturedPost {
  id: string;
  title: string;
  summary: string;
  image_url: string;
  category: string;
  created_at: string;
}

export function BlogSlider() {
  const { t } = useTranslation(['blog', 'common']);
  const [featuredPosts, setFeaturedPosts] = useState<FeaturedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedPosts();
  }, []);

  const fetchFeaturedPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setFeaturedPosts(data || []);
    } catch (error) {
      console.error('Error fetching featured posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <span className="ml-3">{t('loading', { ns: 'common' })}</span>
      </div>
    );
  }

  if (featuredPosts.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mb-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          {t('featured', { ns: 'blog' })}
        </h2>
      </div>
      
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={30}
        slidesPerView={1}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        breakpoints={{
          640: {
            slidesPerView: 2,
            centeredSlides: false,
          },
          1024: {
            slidesPerView: 3,
            centeredSlides: false,
          },
        }}
        className="blog-slider"
      >
        {featuredPosts.map((post) => (
          <SwiperSlide key={post.id}>
            <div 
              className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:transform hover:scale-105 transition-transform duration-300"
              onClick={() => navigate(`/blog/${post.id}`)}
            >
              {post.image_url && (
                <img
                  src={`${supabase.storage.from('blog-images').getPublicUrl(post.image_url).data.publicUrl}`}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-xs">
                    {post.category}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-400 line-clamp-2">
                  {post.summary}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
} 