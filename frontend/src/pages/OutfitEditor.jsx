import { useNavigate, useParams } from "react-router-dom";
import { useItems } from "../hooks/useItems";
import { useOutfit } from "../hooks/useOutfit";
import { useOutfits } from "../hooks/useOutfits";
import OutfitBuilder from "../components/OutfitBuilder";

export default function OutfitEditor() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { items } = useItems({ limit: 500 });
  // Loads existing outfit when editing; returns null outfit when id is undefined (new)
  const { outfit: editingOutfit } = useOutfit(id);
  const { create, update } = useOutfits({ limit: 1 });

  const handleSave = async (outfitData) => {
    if (editingOutfit?._id || editingOutfit?.id) {
      await update(editingOutfit._id || editingOutfit.id, outfitData);
    } else {
      await create(outfitData);
    }
    navigate("/outfits");
  };

  const handleCancel = () => {
    navigate("/outfits");
  };

  return (
    <OutfitBuilder
      items={items}
      editOutfit={editingOutfit}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
