// File Upload Service - Parse File Operations
import Parse from '../client';

export const fileService = {
  // Upload a file to Parse
  async uploadFile(file: File, fileName?: string): Promise<{ url: string; name: string }> {
    const name = fileName || file.name;
    const parseFile = new Parse.File(name, file);
    
    await parseFile.save();
    
    return {
      url: parseFile.url() || '',
      name: parseFile.name(),
    };
  },

  // Upload multiple files
  async uploadMultipleFiles(files: File[]): Promise<{ url: string; name: string }[]> {
    const results = await Promise.all(files.map(file => this.uploadFile(file)));
    return results;
  },

  // Upload base64 image
  async uploadBase64(base64Data: string, fileName: string): Promise<{ url: string; name: string }> {
    const parseFile = new Parse.File(fileName, { base64: base64Data });
    
    await parseFile.save();
    
    return {
      url: parseFile.url() || '',
      name: parseFile.name(),
    };
  },

  // Upload image from data URL (e.g., from canvas or image editor)
  async uploadDataUrl(dataUrl: string, fileName: string): Promise<{ url: string; name: string }> {
    // Extract base64 from data URL
    const base64 = dataUrl.split(',')[1];
    return this.uploadBase64(base64, fileName);
  },

  // Delete a file (Note: Parse doesn't have built-in file deletion via JS SDK)
  // Files are typically deleted through cloud code or server-side operations
  async deleteFile(fileUrl: string): Promise<boolean> {
    // Parse Files cannot be deleted directly from the JS SDK
    // You would need to implement this via Cloud Code
    console.warn('File deletion requires server-side implementation');
    return true;
  },

  // Get file URL (utility function)
  getFileUrl(parseFile: Parse.File | null): string | null {
    if (!parseFile) return null;
    return parseFile.url();
  },

  // Upload profile avatar
  async uploadAvatar(file: File, userId: string): Promise<string> {
    const extension = file.name.split('.').pop();
    const fileName = `avatar_${userId}_${Date.now()}.${extension}`;
    const result = await this.uploadFile(file, fileName);
    return result.url;
  },

  // Upload product image
  async uploadProductImage(file: File, productId: string): Promise<string> {
    const extension = file.name.split('.').pop();
    const fileName = `product_${productId}_${Date.now()}.${extension}`;
    const result = await this.uploadFile(file, fileName);
    return result.url;
  },

  // Upload store logo
  async uploadStoreLogo(file: File, storeId: string): Promise<string> {
    const extension = file.name.split('.').pop();
    const fileName = `store_logo_${storeId}_${Date.now()}.${extension}`;
    const result = await this.uploadFile(file, fileName);
    return result.url;
  },

  // Upload store banner
  async uploadStoreBanner(file: File, storeId: string): Promise<string> {
    const extension = file.name.split('.').pop();
    const fileName = `store_banner_${storeId}_${Date.now()}.${extension}`;
    const result = await this.uploadFile(file, fileName);
    return result.url;
  },

  // Upload forum attachment
  async uploadForumAttachment(file: File, postId: string): Promise<string> {
    const extension = file.name.split('.').pop();
    const fileName = `forum_${postId}_${Date.now()}.${extension}`;
    const result = await this.uploadFile(file, fileName);
    return result.url;
  },
};
