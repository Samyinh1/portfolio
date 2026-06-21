import Profile from '../models/Profile.js';
import seedProfile from '../data/seedProfile.js';

export async function getProfile(_request, response) {
  const profile = await Profile.findOne().lean();
  response.json(profile || seedProfile);
}

export async function upsertProfile(request, response) {
  // $set ensures only sent fields are updated — safe for partial admin saves
  const profile = await Profile.findOneAndUpdate(
    {},
    { $set: request.body },
    { new: true, upsert: true, runValidators: true }
  );
  response.json(profile);
}

export async function uploadResume(request, response) {
  if (!request.file) {
    return response.status(400).json({ message: 'Resume file is required' });
  }

  const resumeUrl = `${request.protocol}://${request.get('host')}/uploads/${request.file.filename}`;
  const existingProfile = await Profile.findOne();
  const profile = existingProfile
    ? await Profile.findByIdAndUpdate(existingProfile._id, { resumeUrl }, { new: true })
    : await Profile.create({ ...seedProfile, resumeUrl });

  response.json({ resumeUrl, profile });
}
