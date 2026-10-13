import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const documentsService = {
  isConfigured: isSupabaseConfigured,

  /**
   * Upload a generated document or asset to Supabase Storage
   * @param {string} bucketName - 'event-flyers', 'event-documents', or 'event-photos'
   * @param {string} filePath - path inside bucket, e.g. 'EVT-2026-001/flyer.pdf'
   * @param {Blob|File} fileBlob
   */
  async uploadFile(bucketName, filePath, fileBlob) {
    if (!isSupabaseConfigured || !supabase) {
      console.info(`[DocumentsService Mock] Simulated upload of ${filePath} to ${bucketName}`);
      return { path: filePath, url: URL.createObjectURL(fileBlob) };
    }

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, fileBlob, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error(`Error uploading to ${bucketName}:`, error);
      throw error;
    }

    return data;
  },

  /**
   * Get public or signed URL for a file
   */
  async getFileUrl(bucketName, filePath, isPrivate = false) {
    if (!isSupabaseConfigured || !supabase) {
      return null;
    }

    if (isPrivate) {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(filePath, 3600); // 1 hour expiration
      if (error) throw error;
      return data?.signedUrl;
    } else {
      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      return data?.publicUrl;
    }
  },

  /**
   * Attach storage path and metadata to documents table
   */
  async recordDocumentUpload(eventId, documentType, fileName, storagePath, metadata = {}) {
    if (!isSupabaseConfigured || !supabase) return;

    try {
      // Find event id
      const { data: evt } = await supabase
        .from('events')
        .select('id')
        .or(`id.eq.${eventId.length === 36 ? eventId : '00000000-0000-0000-0000-000000000000'},event_code.eq.${eventId}`)
        .single();

      if (!evt) return;

      await supabase
        .from('documents')
        .update({
          file_name: fileName,
          storage_path: storagePath,
          status: 'submitted',
          metadata,
          updated_at: new Date().toISOString()
        })
        .match({ event_id: evt.id, document_type: documentType });
    } catch (err) {
      console.error('Error recording document upload:', err);
    }
  }
};
