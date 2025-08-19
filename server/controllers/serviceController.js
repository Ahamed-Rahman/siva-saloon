import Service from '../models/Service.js';

export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching services' });
  }
};

export const createService = async (req, res) => {
  try {
    const { name, priceMin, priceMax, durationMin, durationMax, image } = req.body;
const newService = new Service({ name, priceMin, priceMax, durationMin, durationMax, image });

    await newService.save();
    res.status(201).json({ message: 'Service created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Service creation failed' });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await Service.findByIdAndDelete(id);
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting service' });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving service' });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, priceMin, priceMax, durationMin, durationMax, image } = req.body;
    const updated = await Service.findByIdAndUpdate(
      id,
      { name, priceMin, priceMax, durationMin, durationMax, image },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Service not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Service update failed' });
  }
};

// Update existing stylist
export const updateStylist = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // If password field is non-empty, hash it; otherwise remove it to keep current password
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      delete updateData.password;
    }

    const updated = await Stylist.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Stylist not found' });

    res.json({ message: 'Stylist updated', stylist: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update stylist' });
  }
};


