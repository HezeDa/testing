import { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { PropertyImageCard } from "./property-image-card";

export interface PropertyImage {
  url: string;
  alt?: string;
  is_primary?: boolean;
}

interface DraggableImageGridProps {
  images: PropertyImage[];
  onImagesChange: (images: PropertyImage[]) => void;
}

export function DraggableImageGrid({ images, onImagesChange }: DraggableImageGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.url === active.id);
      const newIndex = images.findIndex((img) => img.url === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newImages = [...images];
        const [movedImage] = newImages.splice(oldIndex, 1);
        newImages.splice(newIndex, 0, movedImage);

        // Обновляем признак основного изображения
        const updatedImages = newImages.map((img, index) => ({
          ...img,
          is_primary: index === 0,
        }));

        onImagesChange(updatedImages);
      }
    }
  };

  const handleRemoveImage = (url: string) => {
    const filteredImages = images.filter((img) => img.url !== url);
    
    // Если удаляем основное изображение, делаем новое первое изображение основным
    const updatedImages = filteredImages.map((img, index) => ({
      ...img,
      is_primary: index === 0,
    }));

    onImagesChange(updatedImages);
  };

  const handleSetPrimaryImage = (url: string) => {
    // Находим изображение, которое нужно сделать основным
    const imageToMakePrimary = images.find((img) => img.url === url);
    
    if (imageToMakePrimary) {
      // Удаляем это изображение из массива
      const otherImages = images.filter((img) => img.url !== url);
      
      // Создаем новый массив, где выбранное изображение стоит первым
      const reorderedImages = [
        { ...imageToMakePrimary, is_primary: true },
        ...otherImages.map(img => ({ ...img, is_primary: false }))
      ];
      
      onImagesChange(reorderedImages);
    }
  };

  if (images.length === 0) {
    return (
      <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Нет загруженных изображений</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={images.map((img) => img.url)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <PropertyImageCard
              key={image.url}
              id={image.url}
              image={image}
              isPrimary={Boolean(index === 0 || image.is_primary)}
              onRemove={() => handleRemoveImage(image.url)}
              onSetPrimary={() => handleSetPrimaryImage(image.url)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
} 