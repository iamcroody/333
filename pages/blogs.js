
import { motion } from "framer-motion";
import { getAllBlogs } from "../data/blogs";

export default function Blogs() {
  const blogs = getAllBlogs();

  return (
    <div className="min-h-screen flex flex-col px-6 md:px-24 pt-32 pb-24 relative">
      
      
      <main className="z-10 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-32"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-foreground">
            Writing.
          </h1>
          <p className="text-lg text-foreground/60 max-w-xl font-light">
            Essays on software architecture, digital ethics, and the craft of code.
          </p>
        </motion.div>

        <div className="flex flex-col gap-12 md:gap-24">
          {blogs.map((blog, idx) => (
            <motion.article 
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group cursor-pointer flex flex-col md:flex-row gap-4 md:gap-12"
            >
              <div className="w-full md:w-32 flex-shrink-0 pt-1">
                <span className="font-mono text-xs tracking-widest text-foreground/40 group-hover:text-foreground transition-colors">
                  {new Date(blog.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()}
                </span>
              </div>
              
              <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground/90 group-hover:text-foreground transition-colors mb-4">
                  {blog.title}
                </h2>
                <p className="text-foreground/60 leading-relaxed font-light mb-6">
                  {blog.preview}
                </p>
                <div className="flex gap-4 items-center">
                  <span className="text-xs uppercase tracking-widest font-mono border-b border-foreground/20 group-hover:border-foreground pb-1 transition-colors">
                    Read Essay
                  </span>
                  <span className="text-xs text-foreground/30 font-mono">
                    {blog.readTime}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </main>
    </div>
  );
}