"use server";

import type { PreviewType } from "./previewFormSchema";

// Mock database - replace with your actual database calls
let previewData: PreviewType | null = null;

export async function updatePreviewAction(data: PreviewType) {
  try {
    // Validate the data
    if (!data.chatbotName || !data.avatarUrl || !data.supportInfo) {
      return {
        ok: false,
        message: "Missing required fields",
        data: null,
      };
    }

    // TODO: Replace with your actual database update logic
    // Example: await db.preview.update({ data })
    previewData = data;

    return {
      ok: true,
      message: "Preview settings updated successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error updating preview:", error);
    return {
      ok: false,
      message: "Failed to update preview settings",
      data: null,
    };
  }
}

export async function getPreviewAction() {
  try {
    // TODO: Replace with your actual database fetch logic
    // Example: const data = await db.preview.findFirst()

    if (!previewData) {
      return {
        ok: true,
        message: "No preview data found",
        data: null,
      };
    }

    return {
      ok: true,
      message: "Preview settings retrieved",
      data: previewData,
    };
  } catch (error) {
    console.error("Error fetching preview:", error);
    return {
      ok: false,
      message: "Failed to fetch preview settings",
      data: null,
    };
  }
}
