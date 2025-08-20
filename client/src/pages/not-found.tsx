import { Layout } from "@/components/layout/layout";
import { Star, Home } from "lucide-react";
import { usePageMetadata } from "@/hooks/use-page-metadata";

export default function NotFound() {
  usePageMetadata('notFound');
  return (
    <Layout>
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--color-warm-white)" }}
      >
        <div className="text-center">
          <Star
            className="w-16 h-16 mx-auto mb-6"
            style={{ color: "var(--color-mid-gray)" }}
          />
          <h1
            className="font-serif text-3xl mb-4"
            style={{ color: "var(--color-charcoal)" }}
          >
            Page Not Found
          </h1>
          <p
            className="text-editorial mb-8 max-w-md mx-auto"
            style={{ color: "var(--color-dark-gray)" }}
          >
            The musical destination you're looking for doesn't exist or has been
            moved. Let's get you back to discovering extraordinary experiences.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="inline-flex items-center gap-2 px-8 py-3 text-sm font-medium rounded-lg border transition-all duration-300"
            style={{
              borderColor: "var(--color-light-gray)",
              color: "var(--color-charcoal)",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-soft-beige)";
              e.currentTarget.style.borderColor = "var(--color-mid-gray)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "var(--color-light-gray)";
            }}
          >
            <Home className="w-4 h-4" />
            Return Home
          </button>
        </div>
      </div>
    </Layout>
  );
}
