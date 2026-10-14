"use client";

import * as React from "react";
import {
  Bell,
  Filter,
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  ExternalLink,
  X,
  FileQuestion,
  Paperclip,
  RotateCw,
  Loader2,
} from "lucide-react";
import { useStudent } from "@/lib/student-context";
import { StudentNotice } from "@/lib/student-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const categories = ["All", "Urgent", "Holiday", "Exam", "New Batch"] as const;

export default function StudentNoticesPage() {
  const { notices, queries, addToast } = useStudent();
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [refreshing, setRefreshing] = React.useState(false);

  // Notice Detail Modal state
  const [detailModalOpen, setDetailModalOpen] = React.useState(false);
  const [activeNotice, setActiveNotice] = React.useState<StudentNotice | null>(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    await queries.notices.refetch();
    setRefreshing(false);
  };

  const getNoticeCategoryVariant = (category: string) => {
    switch (category) {
      case "Urgent":
        return "destructive";
      case "Holiday":
        return "warning";
      case "Exam":
        return "purple";
      case "New Batch":
        return "success";
      default:
        return "secondary";
    }
  };

  const handleOpenNotice = (notice: StudentNotice) => {
    setActiveNotice(notice);
    setDetailModalOpen(true);
  };

  const handleDownloadPdf = (pdfUrl: string) => {
    addToast("Opening official circular...", "success");
    const fullUrl = pdfUrl.startsWith("http")
      ? pdfUrl
      : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:2000"}${pdfUrl.startsWith("/") ? "" : "/"}${pdfUrl}`;
    window.open(fullUrl, "_blank");
  };

  const filteredNotices = notices.filter((n) =>
    selectedCategory === "All" ? true : n.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Notices & Announcements
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Official academic circulars, exam schedules, and campus announcements
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing || queries.notices.isLoading}
          className="text-xs h-8 px-2.5 text-zinc-600 border-zinc-200 hover:text-zinc-900 hover:bg-zinc-50 self-start sm:self-auto"
        >
          <RotateCw
            className={`h-3.5 w-3.5 mr-1.5 text-[#785610] ${
              refreshing || queries.notices.isLoading ? "animate-spin" : ""
            }`}
          />
          {refreshing || queries.notices.isLoading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Loading banner */}
      {queries.notices.isLoading && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900 animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin text-[#785610]" />
          <span>Fetching published circulars from server...</span>
        </div>
      )}

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-[#785610] text-white shadow-xs border border-[#b48a3c]"
                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notices List */}
      <div className="space-y-3">
        {filteredNotices.map((notice) => (
          <Card
            key={notice.id}
            onClick={() => handleOpenNotice(notice)}
            className="border-zinc-200 shadow-xs bg-white hover:border-amber-300 transition-all cursor-pointer group"
          >
            <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={getNoticeCategoryVariant(notice.category) as any}>
                    {notice.category}
                  </Badge>
                  <span className="text-xs text-zinc-400">{notice.date}</span>
                </div>
                <h3 className="text-sm font-bold text-zinc-900 group-hover:text-[#785610] transition-colors leading-snug">
                  {notice.title}
                </h3>
                <p className="text-xs text-zinc-500 line-clamp-2">
                  {notice.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pt-2 sm:pt-0">
                {notice.pdfAttachment && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded-md">
                    <Paperclip className="h-3 w-3" /> PDF
                  </span>
                )}
                <Button variant="ghost" size="sm" className="text-xs text-[#785610] group-hover:bg-amber-50">
                  Read details →
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {!queries.notices.isLoading && filteredNotices.length === 0 && (
          <div className="p-12 text-center bg-white rounded-xl border border-dashed border-zinc-300">
            <FileQuestion className="h-8 w-8 text-zinc-300 mx-auto" />
            <h3 className="text-sm font-semibold text-zinc-700 mt-2">
              No notices in this category
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Try switching back to "All" category.
            </p>
          </div>
        )}
      </div>

      {/* Notice Detail Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent maxWidth="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              {activeNotice && (
                <Badge variant={getNoticeCategoryVariant(activeNotice.category) as any}>
                  {activeNotice.category}
                </Badge>
              )}
              <span className="text-xs text-zinc-400">{activeNotice?.date}</span>
            </div>
            <DialogTitle className="text-base font-bold text-zinc-900 leading-snug">
              {activeNotice?.title}
            </DialogTitle>
          </DialogHeader>

          {activeNotice && (
            <div className="space-y-5 pt-2">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-700 leading-relaxed whitespace-pre-line">
                {activeNotice.description}
              </div>

              {activeNotice.pdfAttachment && (
                <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <FileText className="h-5 w-5 text-[#785610] shrink-0" />
                    <div>
                      <span className="font-semibold text-zinc-900 block truncate max-w-[200px]">
                        {activeNotice.pdfAttachment.split("/").pop()}
                      </span>
                      <span className="text-[10px] text-zinc-500">Official Circular PDF Document</span>
                    </div>
                  </div>

                  <Button
                    variant="gold"
                    size="sm"
                    onClick={() => handleDownloadPdf(activeNotice.pdfAttachment!)}
                    className="text-xs h-8 px-3 shrink-0"
                  >
                    <Download className="h-3.5 w-3.5 mr-1" /> View / Download
                  </Button>
                </div>
              )}

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDetailModalOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
