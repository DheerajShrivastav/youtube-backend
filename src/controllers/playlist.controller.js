import mongoose, { isValidObjectId } from 'mongoose'
import { Playlist } from '../models/playlist.model.js'
import { Video } from '../models/video.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body

  //TODO: create playlist
  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user._id,
  })
  if (!playlist) {
    throw new ApiError(500, 'Playlist creation failed')
  }
  return res
    .status(201)
    .json(new ApiResponse(201, { playlist }, 'Playlist created'))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params
  //TODO: get user playlists
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, 'Invalid user id')
  }
  const playlists = await Playlist.find({ owner: userId })
  if (!playlists) {
    throw new ApiError(404, 'No playlists found')
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { playlists }, 'Playlists found'))
})

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params
  //TODO: get playlist by id
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, 'Invalid playlist id')
  }
  const playlist = await Playlist.findById(playlistId)
  if (!playlist) {
    throw new ApiError(404, 'Playlist not found')
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { playlist }, 'Playlist found'))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, 'Invalid playlist id')
  }
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, 'Invalid video id')
  }
  const playlist = await Playlist.findById(playlistId)
  if (!playlist) {
    throw new ApiError(404, 'Playlist not found')
  }
  if(!Video.findById(videoId)){
    throw new ApiError(404, 'Video not found')
  }
  const videoExists = playlist.videos.includes(videoId)
  if (videoExists) {
    throw new ApiError(400, 'Video already in playlist')
  }
  playlist.videos.push(videoId)
  await playlist.save()
  return res
    .status(200)
    .json(new ApiResponse(200, { playlist }, 'Video added to playlist'))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params
  // TODO: remove video from playlist
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, 'Invalid playlist id')
  }
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, 'Invalid video id')
  }
  const playlist = await Playlist.findById(playlistId)
  if (!playlist) {
    throw new ApiError(404, 'Playlist not found')
  }
  if(!Video.findById(videoId)){
    throw new ApiError(404, 'Video not found')
  }
  const videoExists = playlist.videos.includes(videoId)
  if (!videoExists) {
    throw new ApiError(400, 'Video not in playlist')
  }
  playlist.videos.pull(videoId)
  await playlist.save()
  return res
    .status(200)
    .json(new ApiResponse(200, { playlist }, 'Video removed from playlist'))
})

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params
  // TODO: delete playlist
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, 'Invalid playlist id')
  }
  const playlist = await Playlist.findByIdAndDelete(playlistId)
  if (!playlist) {
    throw new ApiError(404, 'Playlist not found')
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { playlist }, 'Playlist deleted'))
})

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params
  const { name, description } = req.body
  //TODO: update playlist
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, 'Invalid playlist id')
  }
  const playlist = await Playlist.findById(playlistId)
  if (!playlist) {
    throw new ApiError(404, 'Playlist not found')
  }
  playlist.name = name || playlist.name
  playlist.description = description || playlist.description
  await playlist.save()
  return res
    .status(200)
    .json(new ApiResponse(200, { playlist }, 'Playlist updated'))
})

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
}
