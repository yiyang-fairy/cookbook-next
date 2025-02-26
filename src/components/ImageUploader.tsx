import { ImageUploader as AntImageUploader } from 'antd-mobile';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  value?: string;
  onChange?: (url: string) => void;
}

export default function ImageUploader({ value, onChange }: Props) {
  const uploadImage = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `recipe-covers/${fileName}`;

      // 上传文件到 Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false,
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
      console.error('上传图片失败:', error);
      throw error;
    }
  };

  return (
    <AntImageUploader
      value={value ? [{ url: value }] : []}
      onChange={items => {
        const url = items[0]?.url || '';
        onChange?.(url);
      }}
      upload={async (file) => {
        const url = await uploadImage(file);
        return {
          url: url,
        };
      }}
      maxCount={1}
      showUpload={!value}
    />
  );
} 