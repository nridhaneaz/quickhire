import Hero from '../components/Hero';
import Categories from '../components/Categories';
import CTABanner from '../components/CTABanner';
import FeaturedJobs from '../components/FeaturedJobs';
import LatestJobs from '../components/LatestJobs';

export default function Home() {
  return (
    <div>
      <Hero />
      <Categories />
      <CTABanner />
      <FeaturedJobs />
      <LatestJobs />
    </div>
  );
}
