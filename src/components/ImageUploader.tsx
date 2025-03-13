import { ImageUploader as AntImageUploader } from 'antd-mobile';
import { supabase } from '@/lib/supabase';

interface Props {
  value?: string[];
  onChange?: (urls: string[]) => void;
  type?: 'video' | 'img';
  count?: number;
}

export default function ImageUploader({ value = [], onChange, type = 'img', count = 1 }: Props) {
  // 计算文件的 SHA-1 哈希值
  const calculateFileHash = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  const uploadImage = async (file: File) => {
    try {
      // 验证文件类型
      if (type === 'img' && !file.type.startsWith('image/')) {
        throw new Error('请上传图片文件');
      }
      if (type === 'video' && !file.type.startsWith('video/')) {
        throw new Error('请上传视频文件');
      }

      const fileExt = file.name.split('.').pop();
      // 使用文件的 SHA-1 哈希值作为文件名
      const hash = await calculateFileHash(file);
      const fileName = `${hash}.${fileExt}`;
      const folder = type === 'img' ? 'recipe-covers' : 'recipe-videos';
      const filePath = `${folder}/${fileName}`;

      // 检查文件是否已存在
      const { data: existingFiles } = await supabase.storage
        .from('images')
        .list(folder, {
          search: fileName
        });

      // 如果文件已存在，直接返回URL
      if (existingFiles && existingFiles.length > 0) {
        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);
        return data.publicUrl;
      }

      // 上传文件到 Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: true, // 如果文件已存在则覆盖
        });

      if (uploadError) {
        throw uploadError;
      }

      // 获取文件的公共URL
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('上传失败:', error);
      throw error;
    }
  };

  return (
    <AntImageUploader
      value={value.map(url => ({ url }))}
      onChange={items => {
        const urls = items.map(item => item.url);
        onChange?.(urls);
      }}
      upload={async (file) => {
        const url = await uploadImage(file);
        return {
          url: url,
        };
      }}
      maxCount={count}
      showUpload={value.length < count}
      accept={type === 'img' ? 'image/*' : 'video/*'}
    />
  );
} 