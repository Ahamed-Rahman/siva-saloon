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
