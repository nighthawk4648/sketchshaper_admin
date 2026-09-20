import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal";
import Tooltip from "@/components/ui/Tooltip";
import {
  useGetContactMessagesQuery,
  useUpdateContactMessageStatusMutation,
  useDeleteContactMessageMutation,
} from "@/store/api/app/Contact/contactApiSlice";
import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const STATUS_CONFIG = {
  NEW: {
    label: "New",
    badgeClass:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    dotClass: "bg-amber-500",
    icon: "heroicons:bell",
  },
  READ: {
    label: "Read",
    badgeClass:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    dotClass: "bg-emerald-500",
    icon: "heroicons:check-circle",
  },
  ARCHIVED: {
    label: "Archived",
    badgeClass:
      "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20",
    dotClass: "bg-slate-400",
    icon: "heroicons:archive-box",
  },
};

const ContactMessages = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { data, isLoading, isError, error, isFetching } =
    useGetContactMessagesQuery({
      page,
      limit,
      status: statusFilter,
    });

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateContactMessageStatusMutation();
  const [deleteMessage, { isLoading: isDeleting }] =
    useDeleteContactMessageMutation();

  const rawMessages = data?.data?.result || [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.total || 0;

  // Client-side search filtering by name, email, or message content
  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return rawMessages;
    const q = searchQuery.toLowerCase().trim();
    return rawMessages.filter(
      (msg) =>
        msg.name?.toLowerCase().includes(q) ||
        msg.email?.toLowerCase().includes(q) ||
        msg.message?.toLowerCase().includes(q),
    );
  }, [rawMessages, searchQuery]);

  // Open View Modal and auto-mark NEW messages as READ
  const handleViewMessage = async (msg) => {
    setSelectedMessage(msg);
    setIsViewModalOpen(true);

    if (msg.status === "NEW") {
      try {
        await updateStatus({ id: msg.id, status: "READ" }).unwrap();
        setSelectedMessage((prev) =>
          prev ? { ...prev, status: "READ" } : null,
        );
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    }
  };

  // Quick status change handler
  const handleChangeStatus = async (id, nextStatus) => {
    try {
      await updateStatus({ id, status: nextStatus }).unwrap();
      toast.success(`Message status set to ${nextStatus}`);
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage((prev) =>
          prev ? { ...prev, status: nextStatus } : null,
        );
      }
    } catch (requestError) {
      toast.error(requestError?.data?.message || "Failed to update status.");
    }
  };

  // Delete Confirmation handler
  const handleDelete = (msg) => {
    Swal.fire({
      title: "Delete Message?",
      html: `Are you sure you want to delete the message from <b class="text-slate-800 dark:text-white">${msg.name}</b>?<br/><span class="text-xs text-red-500">This action cannot be undone.</span>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        popup:
          "dark:bg-slate-800 dark:text-white rounded-xl shadow-2xl border dark:border-slate-700",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteMessage(msg.id).unwrap();
          toast.success("Message deleted successfully.");
          if (selectedMessage && selectedMessage.id === msg.id) {
            setIsViewModalOpen(false);
            setSelectedMessage(null);
          }
        } catch (err) {
          toast.error(err?.data?.message || "Failed to delete message.");
        }
      }
    });
  };

  // Format readable dates
  const formatDate = (isoString) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <Card noborder className="shadow-lg">
        {/* Top Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-500">
                <Icon icon="heroicons:envelope" className="text-2xl" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                  Contact Messages
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Manage and respond to client inquiries received from the
                  website.
                </p>
              </div>
            </div>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Bar */}
            <div className="relative min-w-[220px]">
              <input
                type="text"
                placeholder="Search sender, email, text..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control py-2 pl-9 text-sm rounded-lg border-slate-200 dark:border-slate-700"
              />
              <Icon
                icon="heroicons:magnifying-glass"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <Icon icon="heroicons:x-mark" />
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="inline-flex rounded-lg p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {[
                { key: "", label: "All" },
                { key: "NEW", label: "New" },
                { key: "READ", label: "Read" },
                { key: "ARCHIVED", label: "Archived" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setStatusFilter(tab.key);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    statusFilter === tab.key
                      ? "bg-white dark:bg-slate-700 text-primary-500 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading & Error States */}
        {isLoading && (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent mb-3"></div>
            <p className="text-sm text-slate-500">Loading messages...</p>
          </div>
        )}

        {isError && (
          <div className="p-8 text-center bg-red-500/10 rounded-xl my-6 border border-red-500/20">
            <Icon
              icon="heroicons:exclamation-triangle"
              className="text-3xl text-red-500 mx-auto mb-2"
            />
            <p className="font-semibold text-red-600">
              Failed to load messages
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {error?.data?.message ||
                "Please check your connection or log in again."}
            </p>
          </div>
        )}

        {/* Messages Table */}
        {!isLoading && !isError && (
          <>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-700">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/40">
                    <th className="py-3.5 px-4 rounded-l-lg">Sender</th>
                    <th className="py-3.5 px-4">Message Snippet</th>
                    <th className="py-3.5 px-4">Received</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right rounded-r-lg">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {filteredMessages.map((msg) => {
                    const statusInfo =
                      STATUS_CONFIG[msg.status] || STATUS_CONFIG.NEW;
                    const isUnread = msg.status === "NEW";

                    return (
                      <tr
                        key={msg.id}
                        onClick={() => handleViewMessage(msg)}
                        className={`group transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                          isUnread
                            ? "bg-amber-500/[0.03] dark:bg-amber-500/[0.04] font-medium"
                            : ""
                        }`}
                      >
                        {/* Sender Info */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${
                                isUnread
                                  ? "bg-amber-500 text-white"
                                  : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                              }`}
                            >
                              {msg.name?.[0]?.toUpperCase() || "?"}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                  {msg.name}
                                </p>
                                {isUnread && (
                                  <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                )}
                              </div>
                              <a
                                href={`mailto:${msg.email}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-xs text-primary-500 hover:underline flex items-center gap-1 mt-0.5"
                              >
                                <Icon
                                  icon="heroicons:envelope"
                                  className="text-xs"
                                />
                                {msg.email}
                              </a>
                            </div>
                          </div>
                        </td>

                        {/* Message Preview */}
                        <td className="py-4 px-4 max-w-xs md:max-w-md">
                          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                            {msg.message}
                          </p>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Icon
                              icon="heroicons:clock"
                              className="text-slate-400"
                            />
                            {formatDate(msg.created_at)}
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td
                          className="py-4 px-4 whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="inline-flex items-center gap-1.5">
                            <select
                              value={msg.status}
                              disabled={isUpdating}
                              onChange={(e) =>
                                handleChangeStatus(msg.id, e.target.value)
                              }
                              className={`text-xs font-semibold py-1 px-2.5 rounded-full cursor-pointer transition border focus:outline-none focus:ring-1 focus:ring-primary-500 ${statusInfo.badgeClass}`}
                            >
                              <option value="NEW">🟡 New</option>
                              <option value="READ">🟢 Read</option>
                              <option value="ARCHIVED">⚪ Archived</option>
                            </select>
                          </div>
                        </td>

                        {/* Actions */}
                        <td
                          className="py-4 px-4 whitespace-nowrap text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Message Button */}
                            <Tooltip content="Read message" placement="top">
                              <button
                                type="button"
                                onClick={() => handleViewMessage(msg)}
                                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-primary-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                              >
                                <Icon
                                  icon="heroicons:eye"
                                  className="text-lg"
                                />
                              </button>
                            </Tooltip>

                            {/* Reply Email Button */}
                            <Tooltip content="Reply via Email" placement="top">
                              <a
                                href={`mailto:${msg.email}?subject=Re:%20Inquiry%20from%20SketchShaper`}
                                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                              >
                                <Icon
                                  icon="heroicons:arrow-uturn-left"
                                  className="text-lg"
                                />
                              </a>
                            </Tooltip>

                            {/* Delete Button */}
                            <Tooltip content="Delete message" placement="top">
                              <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => handleDelete(msg)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                              >
                                <Icon
                                  icon="heroicons:trash"
                                  className="text-lg"
                                />
                              </button>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Empty State */}
              {filteredMessages.length === 0 && (
                <div className="py-16 text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-2xl mb-3">
                    <Icon icon="heroicons:inbox" />
                  </div>
                  <p className="font-semibold text-slate-800 dark:text-white">
                    No messages found
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {searchQuery
                      ? "Try changing your search keywords."
                      : "No contact submissions in this category."}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-700/60 text-sm">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Showing{" "}
                <span className="font-semibold text-slate-800 dark:text-white">
                  {filteredMessages.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-800 dark:text-white">
                  {totalItems}
                </span>{" "}
                message(s)
              </p>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1 || isFetching}
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    className="btn btn-sm btn-outline-dark disabled:opacity-50 py-1 px-3 text-xs flex items-center gap-1 rounded-lg"
                  >
                    <Icon icon="heroicons:chevron-left" /> Previous
                  </button>
                  <span className="text-xs font-semibold px-2 text-slate-600 dark:text-slate-300">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages || isFetching}
                    onClick={() => setPage((p) => p + 1)}
                    className="btn btn-sm btn-outline-dark disabled:opacity-50 py-1 px-3 text-xs flex items-center gap-1 rounded-lg"
                  >
                    Next <Icon icon="heroicons:chevron-right" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </Card>

      {/* Message Details View Modal */}
      <Modal
        activeModal={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Message Details"
        className="max-w-2xl"
        centered
      >
        {selectedMessage && (
          <div className="space-y-6">
            {/* Sender Header Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-primary-500 text-white font-bold text-lg flex items-center justify-center shadow-md">
                  {selectedMessage.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <h5 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedMessage.name}
                  </h5>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-xs text-primary-500 hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <Icon icon="heroicons:envelope" /> {selectedMessage.email}
                  </a>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-1.5">
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Icon icon="heroicons:calendar" />{" "}
                  {formatDate(selectedMessage.created_at)}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Status:</span>
                  <select
                    value={selectedMessage.status}
                    disabled={isUpdating}
                    onChange={(e) =>
                      handleChangeStatus(selectedMessage.id, e.target.value)
                    }
                    className="text-xs font-semibold py-1 px-2.5 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white cursor-pointer"
                  >
                    <option value="NEW">🟡 New</option>
                    <option value="READ">🟢 Read</option>
                    <option value="ARCHIVED">⚪ Archived</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Full Message Content */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Message Body
              </label>
              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 min-h-[160px] text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap select-text font-sans">
                {selectedMessage.message}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                {/* Delete Button */}
                <Button
                  text="Delete"
                  icon="heroicons:trash"
                  className="btn-danger btn-sm"
                  onClick={() => handleDelete(selectedMessage)}
                />

                {/* Archive / Read Quick Toggle */}
                {selectedMessage.status !== "ARCHIVED" && (
                  <Button
                    text="Archive"
                    icon="heroicons:archive-box"
                    className="btn-outline-dark btn-sm"
                    onClick={() =>
                      handleChangeStatus(selectedMessage.id, "ARCHIVED")
                    }
                  />
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Reply via Email */}
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re:%20Inquiry%20from%20SketchShaper&body=%0A%0A---%0AOriginal%20Message%20from%20${selectedMessage.name}:%0A${encodeURIComponent(selectedMessage.message)}`}
                  className="btn btn-sm btn-primary flex items-center gap-1.5 py-2 px-4 rounded-lg font-semibold shadow-sm hover:shadow"
                >
                  <Icon
                    icon="heroicons:arrow-uturn-left"
                    className="text-base"
                  />{" "}
                  Reply via Email
                </a>

                {/* Close Modal */}
                <Button
                  text="Close"
                  className="btn-outline-secondary btn-sm"
                  onClick={() => setIsViewModalOpen(false)}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContactMessages;
