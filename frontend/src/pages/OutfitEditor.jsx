import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { getItems, getOutfitById } from "../utils/localStorage";
import OutfitBuilder from "../components/OutfitBuilder";

export default function OutfitEditor() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [editingOutfit, setEditingOutfit] = useState(null);

  useEffect(() => {
    setItems(getItems());

    // Check if editing existing outfit
    if (id) {
      const outfit = getOutfitById(id);
      if (outfit) {
        setEditingOutfit(outfit);
      } else {
        navigate("/outfits");
      }
    } else if (location.state?.editOutfit) {
      setEditingOutfit(location.state.editOutfit);
    }
  }, [id, location.state, navigate]);

  const handleSave = () => {
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
