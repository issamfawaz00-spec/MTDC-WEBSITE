import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-start justify-center py-24">
      <p className="eyebrow">Page not found</p>
      <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">We couldn&rsquo;t find that page.</h1>
      <p className="mt-5 max-w-lg text-lg text-ink-600">It may have moved, or the product may no longer be listed.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/products" arrow>
          Browse products
        </ButtonLink>
        <ButtonLink href="/" variant="outline">
          Back to home
        </ButtonLink>
      </div>
    </Container>
  );
}
