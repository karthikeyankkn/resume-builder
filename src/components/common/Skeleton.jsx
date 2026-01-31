/**
 * Skeleton loader components for loading states
 */

// Basic skeleton line
export function SkeletonLine({ width = '100%', height = '1rem', className = '' }) {
  return (
    <div
      className={`bg-gray-200 rounded animate-pulse ${className}`}
      style={{ width, height }}
    />
  );
}

// Skeleton circle (for avatars)
export function SkeletonCircle({ size = '3rem', className = '' }) {
  return (
    <div
      className={`bg-gray-200 rounded-full animate-pulse ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

// Skeleton card
export function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="space-y-3">
        <SkeletonLine width="60%" height="1.25rem" />
        <SkeletonLine width="100%" />
        <SkeletonLine width="80%" />
      </div>
    </div>
  );
}

// Skeleton for modal content
export function SkeletonModal({ className = '' }) {
  return (
    <div className={`p-6 space-y-4 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <SkeletonCircle size="2.5rem" />
        <div className="space-y-2 flex-1">
          <SkeletonLine width="40%" height="1.25rem" />
          <SkeletonLine width="60%" height="0.875rem" />
        </div>
      </div>
      <SkeletonLine width="100%" height="2.5rem" />
      <div className="grid grid-cols-2 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

// Skeleton for form fields
export function SkeletonForm({ fields = 4, className = '' }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <SkeletonLine width="30%" height="0.875rem" />
          <SkeletonLine width="100%" height="2.5rem" />
        </div>
      ))}
    </div>
  );
}

// Skeleton for template gallery
export function SkeletonTemplateGallery() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <SkeletonLine width="12rem" height="1.5rem" />
          <SkeletonLine width="16rem" height="0.875rem" />
        </div>
        <SkeletonCircle size="2rem" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <SkeletonLine width="100%" height="180px" className="rounded-lg" />
            <SkeletonLine width="70%" height="1rem" />
            <SkeletonLine width="50%" height="0.75rem" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Skeleton for export modal
export function SkeletonExportModal() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <SkeletonCircle size="2.5rem" />
        <div className="space-y-2">
          <SkeletonLine width="10rem" height="1.25rem" />
          <SkeletonLine width="14rem" height="0.75rem" />
        </div>
      </div>
      <div className="flex gap-2 border-b pb-2">
        <SkeletonLine width="6rem" height="2rem" />
        <SkeletonLine width="6rem" height="2rem" />
      </div>
      <SkeletonLine width="100%" height="20rem" className="rounded-lg" />
      <SkeletonLine width="100%" height="3rem" className="rounded-lg" />
    </div>
  );
}

export default {
  Line: SkeletonLine,
  Circle: SkeletonCircle,
  Card: SkeletonCard,
  Modal: SkeletonModal,
  Form: SkeletonForm,
  TemplateGallery: SkeletonTemplateGallery,
  ExportModal: SkeletonExportModal,
};
